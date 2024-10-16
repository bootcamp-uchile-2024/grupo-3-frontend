import '../styles/index.css'
import Banner from '../components/Banner'
import PlantCareTips from '../components/PlantCareTips';
import CardProducts from '../components/CardProducts';

export default function HomePage() {
  return (
    <div>
       <Banner />
      <CardProducts />
      <PlantCareTips />
    </div>
  );
}
