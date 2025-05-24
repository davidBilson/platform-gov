export interface GetHiringOfferParams {
    jobId: string;
    applicationId: string;
}

export interface HiringDocument {
    _id: string;
    jobId: {
      _id: string;
      title: string;
      description: string;
    };
    clientId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    contractorId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    applicationId: {
      _id: string;
      coverLetter: string;
    };
    status: 'offered' | 'accepted' | 'declined' | 'withdrawn';
    offerDetails: {
      rate: number;
      paymentType: 'hourly' | 'fixed-price' | 'retainer';
      employmentType: 'Full-time' | 'Part-time';
      startDate: string;
      estimatedEndDate?: string;
      milestones?: Array<{
        description: string;
        price: number;
        dueDate: string;
      }>;
    };
    documents: Array<{
      originalName: string;
      url: string;
      publicId: string;
      format: string;
      resourceType: string;
      size: number;
      uploadedAt: string;
    }>;
    clientNotes: string;
    contractorNotes: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface HiringOfferResponse {
    success: boolean;
    data: HiringDocument;
    message: string;
  }