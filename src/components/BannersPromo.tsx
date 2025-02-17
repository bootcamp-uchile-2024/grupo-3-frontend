import '../styles/BannersPromo.css'

interface BannerProps {
    image: string;
    discount: string;
    label: string;
    title: string;
   }
   
   const Banner: React.FC<BannerProps> = ({ image, discount, label, title }) => {
    return (
      <div className="banner">
        <img src={image} alt={title} />
        <div className="banner-content-promo">
          <div className="discount">{discount}</div>
          <div className="label">{label}</div>
          <div className="title">{title}</div>
        </div>
      </div>
    );
   };
   
   const BannerContainer: React.FC = () => {
    const banners = [
      {
        image: "/src/assets/banner-promo01.png",
        label: "Desde",
        discount: "40% Dcto",
        title: "PLANTAS DE INTERIOR"
      },
      {
        image: "/src/assets/banner-promo02.png",
        discount: "40%",
        label: "Dcto",
        title: "PLANTAS DE INTERIOR"
      },
      {
        image: "/src/assets/banner-promo03.jpeg",
        discount: "40%",
        label: "Dcto",
        title: "PLANTAS DE INTERIOR"
      }
    ];
   
    return (
      <div className="banner-container">
        {banners.map((banner, index) => (
          <Banner key={index} {...banner} />
        ))}
      </div>
    );
   };
   
   export default BannerContainer;