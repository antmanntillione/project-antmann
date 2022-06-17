export interface Source {
    id: number;
    document_type: string;
    title: string;
    main_author: string;
    main_publisher: string;
    creation_date: string;
    url: string;
    reviewed: boolean;
    additional_information: object
}

export interface SourceMenuInterface {
    data: Source[];
    triggerShowConentMenu: any
}

export interface SourceItemInterface {
    data: Source;
    source_menu_index: number;
    triggerShowConentMenu: any
}

export interface SourceContentMenuInterface {
    data: null | Source;
}