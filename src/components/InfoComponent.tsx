import { IconType } from "react-icons/lib";

interface infoComponentProps {
    data: string,
    Icon: IconType
}

const InfoComponent = ({ data, Icon }: infoComponentProps) => {
    return (
        <>
            <div className="info">
                <p className='infoLabel'>temperature</p>
                <section className="valueIconWrapper">
                    <Icon className='infoIcon' />
                    <p className="infoValue">{data + " %"}</p>
                </section>
            </div>
        </>
    );
}

export default InfoComponent;