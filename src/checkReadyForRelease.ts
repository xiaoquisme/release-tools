import {pipeLines} from "./pipeline";
import {getPipelineName, getTop3PipelineRunningHistory} from "./pipelineUtils";
import {MaterialRevision, PipelineHistory, PipeLineStage, TrelloResult} from "../module";
import * as _ from "lodash";
import {codeRepoFlag, pipelineUrl, readyForReleaseStageNames} from "./config";

function checkReadyForRelease(pipelines: Array<PipelineHistory>): PipelineHistory | void {
    const readyForReleaseStage: PipeLineStage =
        _.chain(pipelines)
            .flatMap((pipelines: PipelineHistory) => pipelines.stages)
            .filter((stage: PipeLineStage) => _.includes(readyForReleaseStageNames, stage.stageName))
            .filter((stage: PipeLineStage) => stage.stageStatus === 'Passed')
            .first()
            .value();

    if (_.isNil(readyForReleaseStage)) {
        console.error(`${pipelineUrl}/pipeline/activity/${getPipelineName(_.first(pipelines))}`, "not ready for release")
        return;
    }
    return _.chain(pipelines)
        .filter((pipeline: PipelineHistory) => pipeline.stages.some(s => s.stageId === readyForReleaseStage.stageId))
        .first()
        .value();
}

function getCommitter(materialRevisions: Array<MaterialRevision>): string {
    return _.chain(materialRevisions)
        .filter(materialRevision => _.includes(codeRepoFlag, materialRevision.materialName))
        .map(materialRevision => materialRevision.user)
        .first()
        .value();
}

Promise.all(pipeLines.map((pipeLineName: string) =>
    getTop3PipelineRunningHistory(pipeLineName)
        .then(top3Pipelines => checkReadyForRelease(top3Pipelines))))
    .then((results: Array<PipelineHistory | void>) => {
        const successPipelines: Array<PipelineHistory> = _.compact(results) as Array<PipelineHistory>
        console.log("----------------------------")
        console.log("ready for release pipelines!")
        console.log("----------------------------")
        successPipelines.map(pipeline => {
            return {
                pipelineName: getPipelineName(pipeline),
                releaseVersion: pipeline.label,
                committer: getCommitter(pipeline.materialRevisions)
            } as TrelloResult
        }).forEach((trelloResult: TrelloResult) => {
            console.log(`${trelloResult.pipelineName}:${trelloResult.releaseVersion} //@${trelloResult.committer}`)
        })
    })
