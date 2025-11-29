import photo1 from "../../assets/planner-01.jpg";
import photo2 from "../../assets/planner-02.jpg";
import photo3 from "../../assets/planner-03.jpg";
import photo4 from "../../assets/planner-04.jpg";
import photo5 from "../../assets/planner-05.jpg";
import photo6 from "../../assets/planner-06.jpg";
import "./Alimentation.css";

const stripImages = [photo1, photo2, photo3, photo4, photo5, photo6];

function DietPage() {
  return (
    <>
      <div className="page-photo-strip" aria-hidden="true">
        {stripImages.map((src, index) => (
          <div key={index} className="page-photo-strip__item">
            <img src={src} alt={`Inspiration ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="content-page diet-page">
        <div className="page-accent-bar" aria-hidden="true" />
        <div className="page-hero">
          <div className="hero-chip">Diet</div>
          <h2>Diet</h2>
        </div>
        <div className="page-footer-bar" aria-hidden="true" />
      </div>
    </>
  );
}

export default DietPage;
