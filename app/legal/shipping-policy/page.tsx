import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Globe, Building2, Phone } from 'lucide-react';
import Link from 'next/link';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full text-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Shipping Policy</h1>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Effective Date: October 1, 2025</CardTitle>
          </CardHeader>
          <CardContent className="leading-relaxed">
            <p>
              Thank you for choosing Wahtabla for your musical learning journey. Please note that our platform is fully online, 
              and therefore, no physical products or materials are shipped to our students or customers.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">1. Digital Delivery Only</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-900">
              <ul className="space-y-2 list-disc list-inside">
                <li>All our courses, lessons, and instructional materials are delivered digitally through our online portal or app.</li>
                <li>Students receive access credentials (username and password) upon successful registration and payment.</li>
                <li>Lessons are available via recorded video tutorials, and view-only learning materials.</li>
                <li>Doubt clearing sessions are available as per availability.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">2. Access Timeframe</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-900">
              <ul className="space-y-2 list-disc list-inside">
                <li>Once payment is confirmed, access to the purchased course or material is immediately activated or within 24 hours of purchase.</li>
                <li>You will receive an email confirmation containing details of your course access and login instructions.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">3. No Physical Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-900">
              <p>
                As all products are digital, no shipping fees, delivery charges, or tracking numbers are applicable.
                All instructional materials are delivered electronically through our online platform.
              </p>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">4. Technical Issues</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-900">
              <ul className="space-y-2 list-disc list-inside">
                <li>If you face any issues accessing your course or materials, please contact us at the given contact on the website and in your welcome email.</li>
                <li>We will verify your purchase and help restore access as soon as possible.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">5. Updates and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-900">
              <p>
                From time to time, we may update our course materials or improve content delivery. 
                All updates to purchased courses will be made available to existing students through their accounts without additional shipping or handling.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-900 mb-4">
                If you have any questions about this Shipping Policy, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-900">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Email:</span>
                  <span>wahhtabla@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-900">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Phone:</span>
                  <span>+91 3324466076</span>
                </div>
                <div className="flex items-center gap-3 text-slate-900">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Website:</span>
                  <Link href='https://wahtabla.com'>
                    <span className='underline text-blue-700'>https://www.wahtabla.com</span>
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-slate-900">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Office Address:</span>
                  <span>Kolkata, India</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
