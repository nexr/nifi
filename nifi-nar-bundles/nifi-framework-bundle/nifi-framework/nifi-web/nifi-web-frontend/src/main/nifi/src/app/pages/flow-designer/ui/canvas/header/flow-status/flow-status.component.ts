/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input } from '@angular/core';
import { ClusterSummary, ControllerStatus } from '../../../../state/flow';
import { initialState } from '../../../../state/flow/flow.reducer';
import { BulletinsTip } from '../../../../../../ui/common/tooltips/bulletins-tip/bulletins-tip.component';
import { BulletinEntity, BulletinsTipInput } from '../../../../../../state/shared';
import { NgIf } from '@angular/common';
import { Search } from '../search/search.component';
import { NifiTooltipDirective } from '../../../../../../ui/common/tooltips/nifi-tooltip.directive';

@Component({
    selector: 'flow-status',
    standalone: true,
    templateUrl: './flow-status.component.html',
    imports: [NgIf, Search, NifiTooltipDirective],
    styleUrls: ['./flow-status.component.scss']
})
export class FlowStatus {
    @Input() controllerStatus: ControllerStatus = initialState.flowStatus.controllerStatus;
    @Input() lastRefreshed: string = initialState.flow.processGroupFlow.lastRefreshed;
    @Input() clusterSummary: ClusterSummary = initialState.clusterSummary;
    @Input() bulletins: BulletinEntity[] = initialState.controllerBulletins.bulletins;
    @Input() currentProcessGroupId: string = initialState.id;
    @Input() loadingStatus = false;

    protected readonly BulletinsTip = BulletinsTip;

    hasTerminatedThreads(): boolean {
        return this.controllerStatus.terminatedThreadCount > 0;
    }

    formatClusterMessage(): string {
        if (this.clusterSummary.connectedToCluster && this.clusterSummary.connectedNodes) {
            return this.clusterSummary.connectedNodes;
        } else {
            return 'Disconnected';
        }
    }

    getClusterStyle(): string {
        if (
            !this.clusterSummary.connectedToCluster ||
            this.clusterSummary.connectedNodeCount != this.clusterSummary.totalNodeCount
        ) {
            return 'warning';
        }

        return '';
    }

    formatActiveThreads(): string {
        if (this.hasTerminatedThreads()) {
            return `${this.controllerStatus.activeThreadCount} (${this.controllerStatus.terminatedThreadCount})`;
        } else {
            return `${this.controllerStatus.activeThreadCount}`;
        }
    }

    getActiveThreadsTitle(): string {
        if (this.hasTerminatedThreads()) {
            return 'Active Threads (Terminated)';
        } else {
            return 'Active Threads';
        }
    }

    getActiveThreadsStyle(): string {
        if (this.hasTerminatedThreads()) {
            return 'warning';
        } else if (this.controllerStatus.activeThreadCount === 0) {
            return 'zero';
        }
        return '';
    }

    getQueuedStyle(): string {
        if (this.controllerStatus.queued.indexOf('0 / 0') == 0) {
            return 'zero';
        }
        return '';
    }

    formatValue(value: number | undefined) {
        if (value === undefined) {
            return '-';
        }
        return value;
    }

    getActiveStyle(value: number | undefined, activeStyle: string): string {
        if (value === undefined || value <= 0) {
            return 'zero';
        }
        return activeStyle;
    }

    hasBulletins(): boolean {
        return this.bulletins.length > 0;
    }

    getBulletins(): BulletinsTipInput {
        return {
            bulletins: this.bulletins
        };
    }

    getBulletinTooltipXOffset(): number {
        // 500 bulletin tooltip width and 2 * 8 normal tooltip offset
        return -516;
    }
}
