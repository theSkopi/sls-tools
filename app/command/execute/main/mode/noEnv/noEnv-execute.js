const path = require("path");
const {CONSOLE_LOG} = require("../../../../../logger/logger");
const slsToolsApi = require("../../api/sls-tools-api");
const {executeWithRepeat} = require("../execute-helper");
const {loadFile} = require("../../../../../utils/fs-helper");
const {resolveTempDirForNoEnv} = require("./config-helper");
const {processParams} = require("../../../../../configuration/helper/params-processor");

const handleNoEnvExe = async (cmdArgs, configuration) => {
    CONSOLE_LOG.info("Processing execute for no environment");
    const dataset = await loadFile(path.resolve(cmdArgs.path));

    configuration = await processParams(configuration, cmdArgs, false)
    configuration = resolveTempDirForNoEnv(configuration, cmdArgs)

    let lastDtoOut = undefined;
    for (const executionItem of dataset) {
        CONSOLE_LOG.info(`Executing script ${executionItem.name}`);
        lastDtoOut = await executeWithRepeat(
            executionItem,
            slsToolsApi,
            {
                cmdArgs,
                configuration,
                lastDtoOut
            });
    }
}

module.exports = {
    handleNoEnvExe
}