interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '⚡',
    title: 'Instant Access',
    description: 'Navigate to your favorite sites in milliseconds. No more typing long URLs or searching through bookmarks.',
  },
  {
    icon: '🔄',
    title: 'Sync Everywhere',
    description: 'Your shortcuts sync across all your Chrome browsers. Set once, use everywhere.',
  },
  {
    icon: '✨',
    title: 'Dead Simple',
    description: 'No complex setup. Just install and start creating shortcuts. It\'s that easy.',
  },
  {
    icon: '🎨',
    title: 'Fully Customizable',
    description: 'Create any shortcut you want. From go/meet to go/lunch-menu - the possibilities are endless.',
  },
];

export const Features = () => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why You'll Love Go Links</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};