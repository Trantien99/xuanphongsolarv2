import { Link } from "wouter";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">IndustrialSource</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.companyDesc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.products')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products?category=power-tools">
                  <span className="hover:text-white cursor-pointer">{t('categories.powerTools')}</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=safety-equipment">
                  <span className="hover:text-white cursor-pointer">{t('categories.safetyEquipment')}</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics">
                  <span className="hover:text-white cursor-pointer">{t('categories.electronics')}</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=machinery">
                  <span className="hover:text-white cursor-pointer">{t('categories.machinery')}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.contactUs')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.returnPolicy')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.warranty')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.termsOfService')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 IndustrialSource. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
