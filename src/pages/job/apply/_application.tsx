import React, { useState, useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { FiPaperclip } from 'react-icons/fi';
import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { FaRegHourglass } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Jobs } from '@/types/jobs';
import useAuthStore from '@/store/useAuth';
import { ApplicationDraft } from '@/types/jobs';

interface ApplicationProps {
  job: Jobs;
  onClose: () => void;
}

interface ValidationIssue {
  type: 'email' | 'url';
  text: string;
  start: number;
  end: number;
}

const Application: React.FC<ApplicationProps> = ({ job, onClose }) => {

  const { userId } = useAuthStore();

  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedRate: '',
    attachment: null as File | null,
    acknowledgment: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [savedAttachments, setSavedAttachments] = useState<Array<{
    filename: string;
    originalName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  }>>([]);

  const [hasSubmittedApplication, setHasSubmittedApplication] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Validation patterns
  const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+\.[a-z]{2,}|[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|io|ai|app|dev|tech|info|biz|name|pro|me|tv|cc|uk|ca|au|de|fr|jp|cn|in|br|ru|nl|se|no|dk|fi|pl|it|es|pt|mx|ar|cl|pe|ve|co|ec|uy|py|bo|gf|gy|sr|fk|gs|za|ng|ke|tz|ug|rw|gh|sn|ml|bf|ne|td|cf|cm|ga|gq|st|ao|mz|mg|mu|sc|km|dj|so|et|er|sd|ly|dz|ma|tn|eg|il|jo|lb|sy|iq|ir|af|pk|in|np|bt|bd|lk|mv|mm|th|la|kh|vn|my|sg|id|ph|bn|tl|pg|sb|vu|nc|nz|fj|to|ws|ki|nr|pw|fm|mh|tv|tk|nu|ck|pf|as|gu|mp|pr|vi|um)[^\s]*/gi;

  const getJobRate = () => {
    return (job.price || job.retainerAmount || '').toString();
  };

  const validateCoverLetter = (text: string): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    // Check for emails
    let emailMatch;
    const emailRegex = new RegExp(EMAIL_PATTERN);
    while ((emailMatch = emailRegex.exec(text)) !== null) {
      issues.push({
        type: 'email',
        text: emailMatch[0],
        start: emailMatch.index,
        end: emailMatch.index + emailMatch[0].length
      });
    }

    // Check for URLs
    let urlMatch;
    const urlRegex = new RegExp(URL_PATTERN);
    while ((urlMatch = urlRegex.exec(text)) !== null) {
      issues.push({
        type: 'url',
        text: urlMatch[0],
        start: urlMatch.index,
        end: urlMatch.index + urlMatch[0].length
      });
    }

    return issues;
  };

  useEffect(() => {

    setFormData(prev => ({
      ...prev,
      proposedRate: getJobRate(),
    }));

    const fetchSavedDraft = async () => {
      try {
        setIsLoading(true);
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const endPoint = process.env.NEXT_PUBLIC_GET_JOB_APPLICATION_BY_CONTRACTOR_ID?.replace(':id', userId)

        const response = await axios.get(`${baseURL}${endPoint}`);

        if (response.data.success) {

          const submittedApps = response.data.data.filter((app: ApplicationDraft) => {
            const appJobId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
            return appJobId === job._id && app.status !== 'draft';
          });

          if (submittedApps.length > 0) {
            setHasSubmittedApplication(true);
          }

          if (submittedApps.length === 0) {
            const drafts = response.data.data.filter((app: ApplicationDraft) => {
              const appJobId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
              return appJobId === job._id && app.status === 'draft';
            });

            if (drafts.length > 0) {
              const savedDraft = drafts[0];
              setDraftId(savedDraft._id);

              setFormData({
                coverLetter: savedDraft.coverLetter || '',
                proposedRate: savedDraft.proposedRate?.toString() || '',
                attachment: null,
                acknowledgment: savedDraft.certificationAcknowledgment || false,
              });

              // Validate the loaded cover letter
              if (savedDraft.coverLetter) {
                const issues = validateCoverLetter(savedDraft.coverLetter);
                setValidationIssues(issues);
              }

              // Save any attachments for display
              if (savedDraft.attachments && savedDraft.attachments.length > 0) {
                setSavedAttachments(savedDraft.attachments);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching saved draft:', error);
        toast.error("Failed to load saved draft.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && job._id) {
      fetchSavedDraft();
    } else {
      setIsLoading(false);
    }
  }, [job._id, userId, job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'coverLetter') {
      const issues = validateCoverLetter(value);
      setValidationIssues(issues);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachment: files[0],
      }));
    }
  };

  const removeAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachment: null,
    }));
  };

  const removeSavedAttachment = async (filename: string) => {
    try {
      setSavedAttachments(prev => prev.filter(attachment => attachment.filename !== filename));

      if (draftId) {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        await axios.patch(`${baseURL}/applications/update-draft-attachments/${draftId}`, {
          userId,
          action: 'remove',
          filename
        });
        toast.success("Attachment removed successfully.");
      }
    } catch (error) {
      console.error('Error removing attachment:', error);
      toast.error("Failed to remove attachment. Please try again.");
    }
  };

  const getValidationErrorMessage = (): string | null => {
    if (validationIssues.length === 0) return null;

    const emailIssues = validationIssues.filter(issue => issue.type === 'email');
    const urlIssues = validationIssues.filter(issue => issue.type === 'url');

    if (emailIssues.length > 0 && urlIssues.length > 0) {
      return "Please remove email addresses and external links from your cover letter for security reasons.";
    } else if (emailIssues.length > 0) {
      return "Please remove email addresses from your cover letter for security reasons.";
    } else if (urlIssues.length > 0) {
      return "Please remove external links from your cover letter for security reasons.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.coverLetter) {
      toast.error("Please provide a cover letter");
      return;
    }

    // Check for validation issues
    const errorMessage = getValidationErrorMessage();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    if (!formData.proposedRate) {
      toast.error("Please provide your proposed rate");
      return;
    }

    if (!formData.acknowledgment) {
      toast.error("Please acknowledge that you have the required certifications");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data for file upload
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('userId', userId);
      formDataToSubmit.append('jobId', job._id);
      formDataToSubmit.append('coverLetter', formData.coverLetter);
      formDataToSubmit.append('proposedRate', formData.proposedRate);
      formDataToSubmit.append('acknowledgment', String(formData.acknowledgment));

      if (formData.attachment) {
        formDataToSubmit.append('attachment', formData.attachment);
      }

      // Submit application data using environment variables
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const sendApplicationEndpoint = process.env.NEXT_PUBLIC_CREATE_JOB_APPLICATION;

      const response = await axios.post(`${baseURL}${sendApplicationEndpoint}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Application submitted successfully!");

        setDraftId(null);
        setHasSubmittedApplication(true);

        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Error submitting application:', error);

      // Check if the error is an Axios error response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (hasSubmittedApplication) {
      return;
    }

    // Check for validation issues
    const errorMessage = getValidationErrorMessage();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const saveDraftEndpoint = process.env.NEXT_PUBLIC_SAVE_JOB_APPLICATION_DRAFT;

      // Create form data for saving draft
      const formDataToSave = new FormData();
      formDataToSave.append('userId', userId);
      formDataToSave.append('jobId', job._id);
      formDataToSave.append('coverLetter', formData.coverLetter);
      formDataToSave.append('proposedRate', formData.proposedRate);
      formDataToSave.append('acknowledgment', String(formData.acknowledgment));

      if (formData.attachment) {
        formDataToSave.append('attachment', formData.attachment);
      }

      const response = await axios.post(`${baseURL}${saveDraftEndpoint}`, formDataToSave, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setDraftId(response.data.data._id);

        // Update saved attachments if there are any new ones
        if (response.data.data.attachments && response.data.data.attachments.length > 0) {
          setSavedAttachments(response.data.data.attachments);
        }

        toast.success(response.data.message || "Draft saved successfully!");
      }
    } catch (error) {
      console.error('Error saving draft:', error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleDeleteDraft = async () => {
    try {
      if (!draftId) {
        // If there's no draft ID, just clear the form
        setFormData({
          coverLetter: '',
          proposedRate: '',
          attachment: null,
          acknowledgment: false,
        });
        setSavedAttachments([]);
        setValidationIssues([]);
        return;
      }

      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const deleteDraftEndpoint = process.env.NEXT_PUBLIC_DELETE_JOB_APPLICATION_DRAFT?.replace(':id', job._id);

      const response = await axios.delete(`${baseURL}${deleteDraftEndpoint}`, {
        data: { userId }
      });

      if (response.data.success) {
        // Reset form data
        setFormData({
          coverLetter: '',
          proposedRate: '',
          attachment: null,
          acknowledgment: false,
        });

        setSavedAttachments([]);
        setDraftId(null);
        setValidationIssues([]);
        toast.info(response.data.message || "Draft deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting draft:', error);

      // Display the specific error message if available
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete draft. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <section className='h-screen w-full fixed top-0 left-0 z-50 bg-red-500 flex items-center justify-end'>
        <section className='w-full h-screen bg-skyblue p-4 md:p-7.5 overflow-y-auto'>
          <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
          </div>
        </section>
      </section>
    );
  }

  if (hasSubmittedApplication) {
    return (
      <section className='h-screen w-full fixed top-0 left-0 z-50 bg-skyblue flex items-center justify-end'>
        <section className='w-full h-screen bg-skyblue p-4 md:p-7.5 overflow-y-auto'>
          <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex flex-col items-center justify-center h-full'>
            <FaCheckCircle size={50} color="#0B5F94" className="mb-4" />
            <h2 className="text-xl font-bold text-boldblue mb-2">Application Submitted</h2>
            <p className="text-center text-boldblue mb-6">You have submitted an application for this job.</p>
            <button
              onClick={onClose}
              type="button"
              className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 bg-boldblue text-white text-xs md:text-sm font-semibold rounded-lg border border-boldblue"
            >
              Close
            </button>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className='h-screen w-full fixed top-0 left-0 z-50 flex items-center justify-end'>
      <section className='w-full h-screen bg-skyblue p-4 md:p-7.5 overflow-y-auto'>
        <div className='w-full max-w-275 m-auto pb-32 md:pb-64'>

          <h1 className='pb-5 md:pb-7.5 font-semibold text-lg md:text-xl'>Apply To This Job</h1>

          <form id="applicationForm" onSubmit={handleSubmit}>
            <div className='mb-5 md:mb-7.5 relative'>
              <textarea
                ref={textareaRef}
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Cover Letter"
                className='w-full py-3 md:py-3.5 px-4 md:px-5 text-boldblue resize-none bg-white border border-boldblue focus:outline focus:outline-boldblue rounded-md min-h-[100px] md:min-h-[111px]'
              />

              {/* Validation warning */}
              {validationIssues.length > 0 && (
                <div className="bg-crimson/20 p-2 rounded-lg border border-red-600  mt-2">
                  <p className="text-xs md:text-sm text-red-500 font-medium">
                    ⚠️ {getValidationErrorMessage()}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-5 md:mb-7.5">
              <label className="block text-xs md:text-sm text-boldblue font-semibold mb-2">Propose Your Rate</label>
              <div className="w-full max-w-full md:max-w-75 flex justify-between bg-white border border-boldblue rounded-lg px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm text-boldblue">
                <button
                  type="button"
                  className="focus:outline-none"
                >
                  $
                </button>
                <input
                  type="text"
                  name="proposedRate"
                  value={formData.proposedRate}
                  onChange={handleInputChange}
                  placeholder="Enter your rate"
                  className="outline-none placeholder:font-semibold w-full max-w-[90%]"
                />
                <button
                  type="button"
                  className="focus:outline-none"
                >
                  <FaRegHourglass />
                </button>
              </div>
            </div>

            <div className="mb-5 md:mb-7.5">
              <label className="block text-xs md:text-sm text-boldblue font-semibold mb-2">Attach certification document</label>
              <div className="w-full max-w-fit border border-boldblue rounded-lg px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm text-white bg-boldblue">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FiPaperclip size={18} className="mr-2" />
                  <span className="text-white">Attach file</span>
                </label>
              </div>

              {/* Display attached file */}
              {formData.attachment && (
                <div className="mt-3">
                  <div className="flex items-center justify-between bg-white p-2 rounded">
                    <span className="text-xs md:text-sm truncate max-w-[80%]">{formData.attachment.name}</span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="focus:outline-none text-red-500"
                    >
                      <IoCloseOutline size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Display saved attachments */}
              {savedAttachments.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs md:text-sm text-boldblue font-semibold mb-2">Saved Attachments:</p>
                  {savedAttachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded mb-2">
                      <span className="text-xs md:text-sm truncate max-w-[80%]">{attachment.originalName}</span>
                      <button
                        type="button"
                        onClick={() => removeSavedAttachment(attachment.filename)}
                        className="focus:outline-none text-red-500"
                      >
                        <IoCloseOutline size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms acknowledgment */}
            <div className="flex items-center gap-2 md:gap-2.5 mb-5 md:mb-7.5">
              <input
                type="checkbox"
                name="acknowledgment"
                checked={formData.acknowledgment}
                onChange={() => setFormData(prev => ({ ...prev, acknowledgment: !prev.acknowledgment }))}
                className="hidden"
              />
              {formData.acknowledgment ? (
                <FaCheckCircle
                  color='#0B5F94'
                  size={18}
                  onClick={() => setFormData(prev => ({ ...prev, acknowledgment: false }))}
                  className="cursor-pointer flex-shrink-0"
                />
              ) : (
                <RiCheckboxBlankCircleLine
                  color='#0B5F94'
                  size={18}
                  onClick={() => setFormData(prev => ({ ...prev, acknowledgment: true }))}
                  className="cursor-pointer flex-shrink-0"
                />
              )}
              <span className='text-xs md:text-sm'>
                I acknowledge that I have the required certifications and security clearances
              </span>
            </div>

            {/* action buttons */}
            <div className='flex flex-wrap items-center justify-center gap-2 md:gap-2.5'>
              <button
                onClick={onClose}
                type="button"
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDraft}
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Delete Draft
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 border bg-white border-boldblue text-boldblue text-xs md:text-sm font-semibold rounded-lg"
              >
                Save Draft
              </button>
              <button
                type="submit"
                form="applicationForm"
                disabled={isSubmitting || validationIssues.length > 0}
                className={`cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-2 md:py-2.75 px-3 md:px-5 text-xs md:text-sm font-semibold rounded-lg border ${validationIssues.length > 0
                  ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                  : 'bg-boldblue text-white border-boldblue'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>

        </div>
      </section>
    </section>
  );
};

export default Application;