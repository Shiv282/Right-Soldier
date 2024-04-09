import "./loader_style.css";
export default function Loader() {
  return (
    <div>
    <div className="flex justify-center items-center h-full">
    <div className="loader" style={{ width: '4rem', height: '1rem', position: 'relative', animation: 'loader 1s infinite' }}>
      <div className="line" style={{ height: '100%', width: '0.5rem', backgroundColor: '#6C2BD9', position: 'absolute', animation: 'line 1s infinite' }}></div>
      <div className="line line2" style={{ left: '1rem', height: '100%', width: '0.5rem', backgroundColor: '#6C2BD9', position: 'absolute', animation: 'line 1s infinite', animationDelay: '0.2s' }}></div>
      <div className="line line3" style={{ left: '2rem', height: '100%', width: '0.5rem', backgroundColor: '#6C2BD9', position: 'absolute', animation: 'line 1s infinite', animationDelay: '0.4s' }}></div>
    </div>
    </div>
    
  </div>
  );
}
