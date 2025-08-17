'use client';

import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import InstagramButton from './InstagramButton';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <WhatsAppButton
        phone="5579998807035"
        label="WhatsApp"
        message="Olá! Vim pelo site da DevSolution Inovadora e quero solicitar um orçamento."
        utm={{ source: 'site', medium: 'floating', campaign: 'lead_devsolution' }}
        size="md"
        variant="solid"
        className="shadow-lg"
        ariaLabel="Abrir WhatsApp"
      />
      <InstagramButton
        username="paduaviniciusdev"
        label="@paduaviniciusdev"
        size="md"
        variant="outline"
        className="shadow-lg"
        ariaLabel="Abrir Instagram"
      />
    </div>
  );
}
