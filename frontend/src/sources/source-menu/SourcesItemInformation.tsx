import "./SourcesItemInformation.css"
import { Card, Table } from "react-bootstrap"
import { Source } from "../models/source-models"

interface SourcesItemInformationInterface {
    data: Source
}

const SourcesItemInformation = (props: SourcesItemInformationInterface) => {
    let addInfoContent = props.data.additional_information.content
    let addInfoKeys = Object.keys(addInfoContent)
    let addInfoValues = Object.values(addInfoContent)

    return (
        <>
            <Card>
                <Table>
                    <tbody>
                        <>
                            <tr>
                                <td>Publisher</td>
                                <td>{props.data.main_information.publisher}</td>
                            </tr>
                            {addInfoKeys.length != 0 &&
                                addInfoKeys.map((_, i) => {
                                    return (<tr key={i}>
                                        <td>{addInfoKeys[i]}</td>
                                        <td>{addInfoValues[i]}</td>
                                    </tr>)
                                })
                            }
                        </>
                    </tbody>
                </Table>
            </Card>
        </>
    )
}

export default SourcesItemInformation