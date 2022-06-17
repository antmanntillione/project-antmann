import "./API.css"

//emulates backend data storage (database)
const DUMMY_DATA: any = [
    {
      id: 1,
      title: "Title1",
      url: "https://onepiece-tube.com/episoden-streams",
      main_author: "author1",
      main_publisher: "publisher1",
      creation_date:  "02.02.2022",
      document_type: "video",
      additional_information: { 1: 1, 2: 2, 3: 3 }
    },
    {
      id: 2,
      title: "Title2",
      url: "https://www.youtube.com/",
      main_author: "author2",
      main_publisher: "publisher2",
      creation_date:  "02.02.2022",
      document_type: "webpage",
      additional_information: {}
    },
    {
      id: 3,
      title: "Title3",
      url: "https://coolors.co/d8a47f-ef8354-ee4b6a-df3b57-0f7173",
      main_author: "author3",
      main_publisher: "publisher3",
      creation_date:  "02.02.2022",
      document_type: "pdf",
      additional_information: {}
    }
    
  ]

class API {
    constructor() {}
    sendNewContent(newContent: any) {
        DUMMY_DATA.push(newContent)
        //console.log(DUMMY_DATA)
    }

    getContent() {
        return DUMMY_DATA
    }
}

export const api = new API()