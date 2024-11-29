import '../styles/index.css'
import Banner from '../components/Banner'
import CardProducts from '../components/CardProducts';
import GoogleMapEmbed from '../components/GoogleMaps';
import InfoCards from '../components/InfoCards';

export default function HomePage() {
  return (
    <div>
       <Banner />
      <CardProducts />
      <InfoCards />
      <GoogleMapEmbed />
    </div>
  );
}
