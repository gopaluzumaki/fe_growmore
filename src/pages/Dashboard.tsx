import { demo_Property, icon_property } from "../assets";
import Header from "../components/Header";
import DataCard from "../components/DataCard";
import PropertyCard from "../components/PropertyCard";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <div className="my-5 px-2 ml-80">
            <Header />
            <div className="p-4 py-6 grid grid-cols-4 border border-[#E6EDFF] rounded-xl">
              {new Array(4).fill(0).map((_, i) => (
                <DataCard
                  key={i}
                  amount="89,935"
                  title="Total Property"
                  marginValue="10.2"
                  weeklyAmount="1.01"
                  icon={icon_property}
                  isUp
                />
              ))}
            </div>
            <div className="my-4 p-4 py-6 grid grid-cols-3 gap-4 border border-[#E6EDFF] rounded-xl">
              {new Array(3).fill(0).map((_, i) => (
                <PropertyCard
                  key={i}
                  img={demo_Property}
                  name="Damac"
                  location="Downtown"
                  units="5"
                  availUnits={"1bhk, 2bhk, 3bhk"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
