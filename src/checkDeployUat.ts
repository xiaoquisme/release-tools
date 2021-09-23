import {deployUatStageNames, pipelineUrl} from "./config";
import * as _ from 'lodash';
import {pipeLines} from './pipeline';
/// <reference path="../module.ts"/>
import {PipelineHistory, PipeLineStage} from "../module";
import {getPipelineName, getTop3PipelineRunningHistory} from "./pipelineUtils";


function checkDeployUat(top3Pipelines: Array<PipelineHistory>) {
    const deployUatStatus: Array<PipeLineStage> = _.chain(top3Pipelines)
        .flatMap((pipelines: PipelineHistory) => pipelines.stages)
        .filter((stage: PipeLineStage) => _.includes(deployUatStageNames, stage.stageName))
        .filter((stage: PipeLineStage) => stage.stageStatus === 'Passed')
        .value();

    if (_.isEmpty(deployUatStatus)) {
        console.error(`${pipelineUrl}/pipeline/activity/${getPipelineName(_.first(top3Pipelines))}`, " not deploy uat")
    }
}

Promise.all(pipeLines.map((pipeLineName: string) =>
    getTop3PipelineRunningHistory(pipeLineName)
        .then(top3Pipelines => checkDeployUat(top3Pipelines))
));


