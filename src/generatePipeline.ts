import * as _ from 'lodash';
import fs from 'fs';
import axios, {AxiosResponse} from 'axios';

import {cookie, excludePipelines, pipelineUrl} from './config';
/// <reference path="../module.ts"/>
import {Pipeline, ResponseBody} from "../module";


const pipelineNamePattern = /([\w-]+)-plus-(master|release)/


axios
    .get(`${pipelineUrl}/api/dashboard`, {
        headers: {
            cookie: cookie,
            accept: 'application/vnd.go.cd.v4+json',
        },
        params: {
            viewName: 'Default',
            allowEmpty: 'true'
        }
    })
    .then((body: AxiosResponse<ResponseBody>) => {
        const pipeline: Array<Pipeline> =
            body.data._embedded.pipelines
                .map((p: { name: string }) => p.name)
                .filter((pname: string) => pname.match(pipelineNamePattern))
                .filter((pname: string) => !_.some(excludePipelines, excluded => pname.indexOf(excluded) != -1))
                .map((pname: string) => {
                    const pnamePair = pname.split('-plus-')
                    return {
                        "service": pnamePair[0],
                        "type": pnamePair[1],
                        "pipelineName": pname
                    }
                })
        return _.chain(pipeline)
            .groupBy('service')
            .mapValues(value => _.orderBy(value, 'type', 'desc')[0])
            .map(p => p.pipelineName)
            .value()
    })
    .then((pipeLines: any) => {
        fs.writeFileSync("./src/pipeline.ts", `export const pipeLines: Array<string> = ${JSON.stringify(pipeLines)};`);
        return Promise.resolve();
    })
