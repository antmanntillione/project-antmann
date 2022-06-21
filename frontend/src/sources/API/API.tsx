import "./API.css"

//emulates backend data storage (database)
const DUMMY_DATA: any = [
  {
    index: 122334,
    url: "https://onepiece-tube.com/episoden-streams",
    quoted_in: [],
    quotes: [],
    first_version: [],
    is_reviewed: false,
    is_a_copy: false,
    add_to_app_date: new Date("19.06.2022"),
    main_information: {
      title: "One Piece",
      main_author: "Oden",
      publisher: "One Piece Tube",
      document_type: "video",
      creation_date: new Date("14.12.1993")
    },
    additional_information: {
      last_update_date: new Date("14.12.1993"),
      additional_authors: [],
      interviewers: [],
      interviewees: []
    }
  },
  {
    index: 234552,
    url: "https://www.instagram.com/web_and_maths",
    quoted_in: [],
    quotes: [112435],
    first_version: [],
    is_reviewed: false,
    is_a_copy: false,
    add_to_app_date: new Date("14.12.1993"),
    main_information: {
      title: "Web And Maths on Instagram",
      main_author: "vipaboy",
      publisher: "Instagram",
      document_type: "channel",
      creation_date: new Date("14.12.1993")
    },
    additional_information: {
      last_update_date: new Date("14.12.1993"),
      additional_authors: [],
      interviewers: [],
      interviewees: []
    }
  },
  {
    index: 112435,
    url: "https://www.youtube.com/channel/UCRutI3pv-MvAmE30b1zM0tA",
    quoted_in: [234552],
    quotes: [],
    first_version: [],
    is_reviewed: true,
    is_a_copy: false,
    add_to_app_date: new Date("14.12.1993"),
    main_information: {
      title: "Web And Maths on Youtube",
      main_author: "vipaboy",
      publisher: "Youtube",
      document_type: "channel",
      creation_date: new Date("14.12.1993")
    },
    additional_information: {
      last_update_date: new Date("14.12.1993"),
      additional_authors: [],
      interviewers: [],
      interviewees: []
    }
  },

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
      index: 1234, //has to be made unique!
      url: addContentFormData.url,
      quoted_in: [],
      quotes: [],
      first_version: [],
      is_reviewed: false,
      is_a_copy: false,
      add_to_app_date: new Date(),
      main_information: {
        title: addContentFormData.title,
        main_author: addContentFormData.author,
        publisher: addContentFormData.publisher,
        document_type: addContentFormData.doctype,
        creation_date: addContentFormData.date
      },
      additional_information: {
        last_update_date: null,
        additional_authors: [],
        interviewers: [],
        interviewees: []
      }
    }

    //add new source to database
    DUMMY_DATA.push(newSource)
  }

  getContent() {
    return DUMMY_DATA
  }
}

export const api = new API()