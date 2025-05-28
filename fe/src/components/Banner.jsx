import React from "react";
import { MapPin, Calendar } from "lucide-react";
import "@fontsource/roboto-slab"; // Install with `npm install @fontsource/roboto-slab`

const Banner = () => {
  return (
    <div className="relative h-64 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://thanhnien.mediacdn.vn/Uploaded/khanhtd/2022_10_09/d913c1cf13c4d49a8dd515-3329.jpg')",
          backgroundPosition: "center 26%",
        }}
      ></div>
      {/* <div className="relative container mx-auto h-full flex items-center justify-center text-center text-gray-100 px-4">
        <div className="max-w-2xl">
          <h2
            className="text-4xl font-bold mb-4 text-black"
            style={{
              textShadow: "1px 1px 2px white",
              fontFamily: "'Roboto Slab', serif",
            }}
          >
            Bến Xe Miền Đông
          </h2>
          <p
            className="text-xl mb-6 text-black"
            style={{
              textShadow: "1px 1px 2px white",
              fontFamily: "'Roboto Slab', serif",
            }}
          >
            Đồng Hành Cùng Bạn, Vạn Dặm Bình An
          </p>
          <div className="flex justify-center space-x-4">
            <div
              className="flex items-center bg-white/60 rounded-full px-4 py-2 space-x-2"
              style={{
                textShadow: "1px 1px 2px white",
                fontFamily: "'Roboto Slab', serif",
              }}
            >
              <MapPin size={24} className="text-black" />
              <span className="text-black">Phủ sóng toàn quốc</span>
            </div>
            <div
              className="flex items-center bg-white/60 rounded-full px-4 py-2 space-x-2"
              style={{
                textShadow: "1px 1px 2px white",
                fontFamily: "'Roboto Slab', serif",
              }}
            >
              <Calendar size={24} className="text-black" />
              <span className="text-black">Đặt chỗ linh hoạt</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Banner;
