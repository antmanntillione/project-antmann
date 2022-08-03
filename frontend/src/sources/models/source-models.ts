/*
NOT YET IMPLEMENTED:
Dates can be stored in the following format:
2. February 2022 is stored as 20220202
14 December 1993 is stored as 19931214
So its always a six digits number. 

*/

export interface Source2 {
    id: string;
    document_type: string;
    title: string;
    main_author: string;
    main_publisher: string;
    creation_date: string;
    url: string;
    reviewed: boolean;
    additional_information: object;
}

export interface Source {
    main_information: Main_Information;
    meta_information: Meta_Information; 
    additional_information: Additional_Information;
}

interface Main_Information {
    title: string;
    main_author: string;
    publisher: string;
    document_type: string;
    creation_date: Date; 
}

interface Meta_Information {
    index: number;
    url: string;
    quoted_in: string[];
    quotes: string[];
    first_version: string[];
    is_reviewed: boolean;
    is_a_copy: boolean;
    add_to_app_date: Date;
}

interface Additional_Information {
    content: object
}

/*
interface Additional_Information2 {
    last_update_date: Date | null;
    additional_authors: string[];
    interviewers: string[];
    interviewees: string[]
}
*/