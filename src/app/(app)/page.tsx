'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import messages from "@/message.json" 

export default function HomePage() {
  // const messages = [
  //   "The key is under the doormat.",
  //   "Meet me at the usual spot at midnight.",
  //   "The package will be delivered by a man in a red hat.",
  //   "The password is 'whisper'.",
  //   "Look for the blue flower in the garden.",
  // ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="py-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Mystery Message</h1>
        <p className="mt-2 text-gray-600">Uncover the secrets hidden in plain sight</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-xl mx-auto">
          <CarouselContent>
          {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg font-semibold text-gray-800">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-6 h-40">
                    <p className="text-xl text-center font-medium text-gray-700">{message.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </div>
  )
}