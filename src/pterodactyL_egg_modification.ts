import mysql from 'mysql2';
import { Connection } from 'mysql2';

const eggVariableCustomStartup = {
  name: "Custom Startup",
  description: "Custom Startup for Java line argument.",
  env_variable: "CUSTOM_STARTUP",
  default_value: "java -jar server.jar",
  user_viewable: true,
  user_editable: true,
  rules: "required|string|max:3000",
}

const eggVariableCustomStartupEnabled = {
  name: "Enable Custom Startup",
  description: `Enables the custom startup, this can only be set by admin.\nPlease contact administrator for access`,
  env_variable: "CUSTOM_STARTUP_ENABLE",
  default_value: "0",
  user_viewable: true,
  user_editable: false,
  rules: "required|boolean",
}

const CUSTOMSTARTUPCOMMANDFOREGG = `if [[ {{CUSTOM_STARTUP_ENABLE}} == "1" ]] && [[ -n "{{CUSTOM_STARTUP}}" ]]; then {{CUSTOM_STARTUP}}; else java -Xms256M -XX:MaxRAMPercentage=92.5 -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar {{SERVER_JARFILE}}; fi`

export async function startEggModification(connection: Connection) {
  // get string array
  let ids: number[] = ((await connection.promise().query("SELECT id FROM eggs WHERE nest_id = 192"))[0] as []).map((x: any) => x.id);
  for(const eggId of ids) {
    await connection.promise().query("DELETE FROM egg_variables WHERE egg_id = ? AND env_variable = ?", [eggId, "CUSTOM_STARTUP"]);
    await connection.promise().query("INSERT INTO egg_variables (name, description, env_variable, default_value, user_viewable, user_editable, rules, egg_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [eggVariableCustomStartup.name, eggVariableCustomStartup.description, eggVariableCustomStartup.env_variable, eggVariableCustomStartup.default_value, eggVariableCustomStartup.user_viewable, eggVariableCustomStartup.user_editable, eggVariableCustomStartup.rules, eggId]);

    await connection.promise().query("DELETE FROM egg_variables WHERE egg_id = ? AND env_variable = ?", [eggId, "CUSTOM_STARTUP_ENABLE"]);
    await connection.promise().query("INSERT INTO egg_variables (name, description, env_variable, default_value, user_viewable, user_editable, rules, egg_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [eggVariableCustomStartupEnabled.name, eggVariableCustomStartupEnabled.description, eggVariableCustomStartupEnabled.env_variable, eggVariableCustomStartupEnabled.default_value, eggVariableCustomStartupEnabled.user_viewable, eggVariableCustomStartupEnabled.user_editable, eggVariableCustomStartupEnabled.rules, eggId]);

    await connection.promise().query("UPDATE eggs SET startup = ? WHERE id = ?", [CUSTOMSTARTUPCOMMANDFOREGG, eggId]);
  }
}