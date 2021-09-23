import {getPipelineName} from "./src/pipelineUtils";

export interface ResponseBody {
    _embedded: {
        pipelines: Array<{ name: string }>
    },
}

export interface Pipeline {
    service: string,
    type: string,
    pipelineName: String
}

export interface PipelineDetail {
    groups: Array<{ history: Array<PipelineHistory> }>,
    pipelineName: string,
}

export interface MaterialRevision {
    modifications: Array<{ user: string, comment: string }>,
    date: string,
    changed: string,
    materialName: string,
}

export interface Commit {
    triggerDate: string,
    changed: string,
    materialName: string,
    email: string,
    comment: string
}

export interface PipeLineStage {
    stageId: number,
    stageName: string,
    stageStatus: string,
    stageLocator: string;
}

export interface PipelineHistory {
    stages: Array<PipeLineStage>,
    materialRevisions: Array<MaterialRevision>,
    label: string
}

export interface PipelineStages {
    stageStatus: 'Passed' | any,
}

export interface  MaterialRevision {
    user: string,
    materialName: string,
}
export interface TrelloResult {
    pipelineName: string,
    releaseVersion: string,
    committer: string
}
