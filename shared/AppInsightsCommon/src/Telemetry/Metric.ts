// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MetricData } from "../Interfaces/Contracts/Generated/MetricData";
import { ISerializable } from "../Interfaces/Telemetry/ISerializable";
import { dataSanitizeMeasurements, dataSanitizeProperties, dataSanitizeString } from "./Common/DataSanitizer";
import { FieldType } from "../Enums";
import { DataPoint } from "./Common/DataPoint";
import { IDiagnosticLogger } from "@microsoft/applicationinsights-core-js";
import { strNotSpecified } from "../Constants";

export class Metric extends MetricData implements ISerializable {

    public static envelopeType = "Microsoft.ApplicationInsights.{0}.Metric";
    public static dataType = "MetricData";

    public aiDataContract = {
        ver: FieldType.Required,
        metrics: FieldType.Required,
        properties: FieldType.Default
    }

    /**
     * Constructs a new instance of the MetricTelemetry object
     */
    constructor(logger: IDiagnosticLogger, name: string, value: number, count?: number, min?: number, max?: number, stdDev?: number, properties?: any, measurements?: { [key: string]: number }) {
        super();

        const dataPoint = new DataPoint();
        dataPoint.count = count > 0 ? count : undefined;
        dataPoint.max = isNaN(max) || max === null ? undefined : max;
        dataPoint.min = isNaN(min) || min === null ? undefined : min;
        dataPoint.name = dataSanitizeString(logger, name) || strNotSpecified;
        dataPoint.value = value;
        dataPoint.stdDev = isNaN(stdDev) || stdDev === null ? undefined : stdDev;

        this.metrics = [dataPoint];
        this.properties = dataSanitizeProperties(logger, properties);
        this.measurements = dataSanitizeMeasurements(logger, measurements);
    }
}
