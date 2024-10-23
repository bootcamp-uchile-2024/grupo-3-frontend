import '../styles/index.css'
import Banner from '../components/Banner'
import FeaturedColumns from '../components/FeaturedColumns';
import CardProducts from '../components/CardProducts';

export default function HomePage() {
  return (
    <div>
       <Banner />
      <CardProducts />
      <FeaturedColumns />
    </div>
  );
}
