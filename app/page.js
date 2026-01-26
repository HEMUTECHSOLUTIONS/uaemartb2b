export const metadata = {
  title: 'UAE Mart - UAE\'s Premier B2B Marketplace',
  description: 'Professional B2B marketplace platform for UAE',
};

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        body { margin: 0; padding: 0; }
        html { margin: 0; padding: 0; }
      `}</style>
      <iframe
        src="/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block',
        }}
        title="UAE Mart"
        frameBorder="0"
      />
    </div>
  );
}
