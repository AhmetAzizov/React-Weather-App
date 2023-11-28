import { IconType } from "react-icons/lib";
import styles from '../styles/InfoComponent.module.css'

interface infoComponentProps {
    className?: string,
    data: string,
    label: string,
    Icon: IconType
}

const InfoComponent = ({ className, data, label, Icon }: infoComponentProps) => {
    return (
        <>
            <div className={`${styles.info} ${className}`}>
                <p className={styles.infoLabel}>{label}</p>
                <section className={styles.valueIconWrapper}>
                    <Icon className='infoIcon' />
                    <p className="infoValue">{data}</p>
                </section>
            </div>
        </>
    );
}

export default InfoComponent;