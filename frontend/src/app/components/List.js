import { useState } from 'react';
import backArrow from '../assets/Curved-Arrow-PNG_1024.png';
import Image from 'next/image';

export default function List(){

    const headerExample = "CSI_320-01";
    const arrayExample = ['Eddie Slobodow', 'John Smith', 'Supercoolfirstname Supercoollastname'];
    const layerExample = "Students";

    // Will be ran when the back button is clicked to move back up the heirarchy
    const upHierarchy = (item) => {
        console.log('Clicked:', item);
    }

    // Will be ran when a data entry is clicked to move further down the heirarchy
    const downHierarchy = (item) => {
        console.log('Clicked:', item);
    };
      
    return (
        <>
        <table className="verticalTable">
            <tr>
                <th>{headerExample}
                    <div className="backButton" onClick={() => upHierarchy(headerExample)}>
                    <Image src={backArrow} alt="Back arrow" width={25} height={25} />
                    </div>
                </th>

                {arrayExample.map((item, index) => (
                <td key={index} className="dataEntry" onClick={() => downHierarchy(item)}>
                    {item}
                </td>
                ))}

            </tr>
        </table>
        </>
    );
}