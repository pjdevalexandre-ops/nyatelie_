"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Truck } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

export default function Footer() {
  return (
    <footer className="bg-[#EBF3FA] border-t border-[#CBE3F5] mt-auto">
      <div className="crochet-divider" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-center md:text-left justify-between">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#38A9E4] bg-[#38A9E4]">
                <Image src="/logo.png" alt="NyAtelie" fill className="object-cover" />
              </div>
              <span className="font-serif-craft text-xl font-bold text-[#1A364A]">NyAtelie</span>
            </div>
            <p className="text-sm text-[#4A6B82] leading-relaxed max-w-md">
              Peças artesanais em crochê feitas à mão com amor, dedicação e excelente acabamento. Cada encomenda é tecida especialmente para você.
            </p>
          </div>

          <div className="text-center md:text-right">
            <h3 className="font-serif-craft font-semibold text-[#1A364A] text-base mb-3">Localização & Redes Sociais</h3>
            <ul className="text-sm text-[#4A6B82] space-y-2.5">
              <li className="flex items-center justify-center md:justify-end gap-2">
                <MapPin className="w-4 h-4 text-[#38A9E4]" />
                <span>São Miguel do Guamá - PA</span>
              </li>
              <li className="flex items-center justify-center md:justify-end gap-2">
                <Truck className="w-4 h-4 text-[#38A9E4]" />
                <span>Entregamos para todo o Brasil</span>
              </li>
              <li className="flex items-center justify-center md:justify-end gap-2">
                <InstagramIcon className="w-4 h-4 text-[#38A9E4]" />
                <a href="https://instagram.com/nyatelie_" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-[#38A9E4]">
                  @nyatelie_
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#CBE3F5] text-center text-xs text-[#4A6B82] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NyAtelie • São Miguel do Guamá - PA. Todos os direitos reservados.</p>
          <p className="flex items-center justify-center gap-1.5 font-medium">
            Feito com <Heart className="w-3.5 h-3.5 fill-[#38A9E4] text-[#38A9E4]" /> em cada ponto
          </p>
        </div>
      </div>
    </footer>
  );
}
