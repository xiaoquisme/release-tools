import {PipelineDetail, PipelineHistory} from "../module";
import axios, {AxiosResponse} from "axios";
import {cookie, pipelineUrl} from "./config";
import * as _ from "lodash";

export function getPipelineName(pipelineHistory: PipelineHistory | undefined): string {
    return pipelineHistory && pipelineHistory.stages[0].stageLocator.split('/')[0] || "";
}

export function getTop3PipelineRunningHistory(pipelineName: String): Promise<Array<PipelineHistory>> {
    return axios
        .get(`${pipelineUrl}/pipelineHistory.json`, {
            headers: {
                cookie: cookie,
                accept: 'application/vnd.go.cd+json'
            },
            params: {
                pipelineName
            }
        })
        .then((body: AxiosResponse<PipelineDetail>) => body.data)
        .then((resp: PipelineDetail) => {
            const history: Array<PipelineHistory> = resp.groups[0].history;
            return _.slice(history, 0, 3);
        })
}
