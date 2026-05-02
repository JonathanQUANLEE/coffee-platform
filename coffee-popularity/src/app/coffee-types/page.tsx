import Header from '@/components/Header';
import { getCoffeeTypes } from '@/data';

export default function CoffeeTypesPage() {
  const coffeeTypes = getCoffeeTypes();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            咖啡百科
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            了解各种咖啡的历史、特点和风味，成为真正的咖啡专家
          </p>
        </div>
      </section>

      {/* Coffee Types List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coffeeTypes.map(type => (
              <div key={type.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-amber-900">{type.name}</h2>
                      <p className="text-amber-600">{type.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        {type.origin}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">历史起源</h3>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        {type.history}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">风味特点</h3>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        {type.flavorProfile}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">详细介绍</h3>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      type.caffeineContent === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : type.caffeineContent === 'medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      咖啡因: {type.caffeineContent === 'high' ? '高' : type.caffeineContent === 'medium' ? '中' : '低'}
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      type.taste === 'sweet' 
                        ? 'bg-pink-100 text-pink-800' 
                        : type.taste === 'bitter' 
                          ? 'bg-gray-100 text-gray-800' 
                          : type.taste === 'balanced' 
                            ? 'bg-blue-100 text-blue-800' 
                            : type.taste === 'fruity' 
                              ? 'bg-purple-100 text-purple-800' 
                              : type.taste === 'nutty' 
                                ? 'bg-amber-100 text-amber-800' 
                                : type.taste === 'smooth'
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-orange-100 text-orange-800'
                    }`}>
                      口感: {type.taste === 'sweet' ? '甜' : type.taste === 'bitter' ? '苦' : type.taste === 'balanced' ? '均衡' : type.taste === 'fruity' ? '果味' : type.taste === 'nutty' ? '坚果' : type.taste === 'smooth' ? '顺滑' : '巧克力'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}