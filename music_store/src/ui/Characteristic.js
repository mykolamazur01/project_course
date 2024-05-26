
import style from './Characteristic.module.css';
export default function Characteristic({ name, value }) {
  return (
    <p className={style.main}><span className={style.name}>{name}</span> - <span className={style.value}>{value}</span></p>
  );
}