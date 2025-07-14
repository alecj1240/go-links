interface DemoItem {
  shortcut: string;
  destination: string;
  icon: string;
}

const demoItems: DemoItem[] = [
  { shortcut: 'calendar', destination: 'calendar.google.com', icon: '📅' },
  { shortcut: 'drive', destination: 'drive.google.com', icon: '📁' },
  { shortcut: 'pr', destination: 'github.com/pulls', icon: '📋' },
  { shortcut: 'standup', destination: 'meet.google.com/abc-defg-hij', icon: '📹' },
];

export const Demo = () => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">See the Magic</h2>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-6 w-full">
                <div className="flex items-center">
                  <span className="text-gray-400 font-mono">go/</span>
                  <span className="font-mono font-semibold text-lg">{item.shortcut}</span>
                </div>
                
                <div className="text-xl text-gray-400">→</div>
                
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-xl">{item.icon}</span>
                  <div className="text-sm font-mono text-gray-600 truncate">
                    {item.destination}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};