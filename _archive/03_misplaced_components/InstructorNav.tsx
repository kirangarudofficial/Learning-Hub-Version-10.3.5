import React from 'react';

// A simple placeholder for navigation icons.
// In a real app, you would use an icon library like react-icons or SVGs.
const NavIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="mr-3 text-xl">{children}</span>
);

const navItems = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Courses', icon: '📚' },
  { name: 'Analytics', icon: '📈' },
  { name: 'Communication', icon: '💬' },
  { name: 'Tools', icon: '🛠️' },
  { name: 'Profile', icon: '👤' },
];

export const InstructorNav: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6 text-2xl font-bold text-blue-600 border-b">Learning Hub</div>
      <nav className="mt-6">
        {navItems.map((item, index) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${index === 0 ? 'bg-blue-50 text-blue-600' : ''}`}
          >
            <NavIcon>{item.icon}</NavIcon> {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};