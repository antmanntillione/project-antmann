import "./SourcesItemInformation.css"
import { Card, Table } from "react-bootstrap"
import { Source } from "../models/source-models"

interface SourcesItemInformationInterface {
    data: Source
}

const SourcesItemInformation = (props: SourcesItemInformationInterface) => {
    const obj = { 1: 1, 2: 2, 3: 3 }
    const keys2 = Object.keys(obj)
    const values2 = Object.values(obj)
    return (
        <>
            <Card>
                <Table>
                    <tbody>
                        <tr>
                            <td>Main Publisher</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Additional Information</td>
                            <td>{JSON.stringify(props.data.additional_information)}</td>
                        </tr>
                       
                    </tbody>
                </Table>
            </Card>
        </>
    )
}

export default SourcesItemInformation