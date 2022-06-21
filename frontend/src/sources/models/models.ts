import { Source } from "./source-models"

export interface SourceMenuInterface {
    data: Source[];
    triggerShowContentMenu: any
}

export interface SourceItemInterface {
    data: Source;
    triggerShowContentMenu: any
}

export interface SourceContentMenuInterface {
    data: null | Source;
}