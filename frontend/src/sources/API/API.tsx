import "./API.css"

//emulates backend data storage (database)
const DUMMY_DATA: any = [
    {
      id: 1,
      title: "Title1",
      url: "URL1",
      author: "author1",
      publisher: "publisher1"
    },
    {
      id: 2,
      title: "Title2",
      url: "URL2",
      author: "author2",
      publisher: "publisher2"
    },
    {
      id: 3,
      title: "Title3",
      url: "URL3",
      author: "author3",
      publisher: "publisher3"
    }
  ]

class API {
    constructor() {}
    sendNewContent(newContent: any) {
        DUMMY_DATA.push(newContent)
        console.log(DUMMY_DATA)
    }

    getContent() {
        return DUMMY_DATA
    }
}

export const api = new API()