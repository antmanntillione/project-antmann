import "./API.css"

//emulates backend data storage (database)
const DUMMY_DATA: any = [
  {
    main_information: {
      title: "One Piece",
      main_author: "Oden",
      publisher: "One Piece Tube",
      document_type: "video",
      creation_date: new Date("December 14, 1993")
    },
    meta_information: {
      index: 122334,
      url: "https://onepiece-tube.com/episoden-streams",
      quoted_in: [],
      quotes: [],
      first_version: [],
      is_reviewed: false,
      is_a_copy: false,
      add_to_app_date: new Date("19.06.2022"),
    },
    additional_information: {
      content: {}
    }
  },
  {
    main_information: {
      title: "Web And Maths on Youtube",
      main_author: "vipaboy",
      publisher: "Youtube",
      document_type: "video",
      creation_date: new Date("December 14, 1993")
    },
    meta_information: {
      index: 112435,
      url: "https://www.youtube.com/channel/UCRutI3pv-MvAmE30b1zM0tA",
      quoted_in: [234552],
      quotes: [],
      first_version: [],
      is_reviewed: true,
      is_a_copy: false,
      add_to_app_date: new Date("19.06.2022"),
    },
    additional_information: {
      content: {
        additional_publisher: ["Victor Sombrero"]
      }
    }
  },
  {
    main_information: {
      title: "Web And Maths on Instagram",
      main_author: "vipaboy",
      publisher: "Instagram",
      document_type: "image",
      creation_date: new Date("December 14, 1993")
    },
    meta_information: {
      index: 234552,
      url: "https://www.instagram.com/web_and_maths",
      quoted_in: [],
      quotes: [112435],
      first_version: [],
      is_reviewed: false,
      is_a_copy: false,
      add_to_app_date: new Date("14. December 1993"),
    },
    additional_information: {
      content: {}
    }
  }
]

class API {
  constructor() { }

  addNewSource(addContentFormData: any) {
    /*
    ATTENTION:
    addContentFormData is the data send from the add Content form. It is NOT YET in the correct 
    source format, so it must be transformed into that. That should happen in the following.
    */

    /*
    This should be the correct source format. 
    Always compare with the datebase format, the source-models and the specs.
    */
    const newSource = {
      meta_information: {
        index: 1234, //has to be made unique!
        url: addContentFormData.url,
        quoted_in: [],
        quotes: [],
        first_version: [],
        is_reviewed: false,
        is_a_copy: false,
        add_to_app_date: new Date(),
      },
      main_information: {
        title: addContentFormData.title,
        main_author: addContentFormData.author,
        publisher: addContentFormData.publisher,
        document_type: addContentFormData.doctype,
        creation_date: addContentFormData.date
      },
      additional_information: {
        content: addContentFormData.additional_content
      }
    }

    //add new source to database
    DUMMY_DATA.push(newSource)
  }

  getAllContent() {
    return DUMMY_DATA
  }

  getSearchedContent(searchText: string) {
    return DUMMY_DATA.filter((source: any, i: any) => {
      return (
        source.main_information.title.includes(searchText) ||
        source.main_information.main_author.includes(searchText) ||
        source.main_information.publisher.includes(searchText)
      )
    })
  }
}

export const api = new API()