import Lottie from 'react-lottie-player';
import loaderJson from '@/shared/assets/loader.json';
import classes from './Loader.module.scss';


interface ILoader{
  center?: boolean;
  tall?: boolean;
}
const Loader = ({ center, tall }:ILoader) => {
  return (
    <div className={`${center ? classes.center : ''} ${tall ? classes.tall : ''}`}>
      {/* <Lottie
        animationData={loaderJson}
        className={classes.loader}
        loop
        play
      /> */}
    </div>
  );
};

export default Loader;
