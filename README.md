# Style Guide

## Click Effect For Buttons
transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer

bg-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold
## Hover Effect For Buttons
hover:opacity-70 transition duration-300 ease-in-out cursor-pointer

## Focus Effect For Input Fields
focus:outline focus:outline-boldblue



# API RESPONSE FOR GET JOB APPLICATIONS BY JOB ID

[
    "success",
    "count",
    "data",
    "data._id",
    "data.jobId",
    "data.freelancerId",
    "data.freelancerProfileId",
    "data.freelancerProfileId.location",
    "data.freelancerProfileId.location.country",
    "data.freelancerProfileId.location.state",
    "data.freelancerProfileId._id",
    "data.freelancerProfileId.user",
    "data.freelancerProfileId.user._id",
    "data.freelancerProfileId.user.name",
    "data.freelancerProfileId.profileImage",
    "data.freelancerProfileId.ratePerHour",
    "data.freelancerProfileId.primaryPosition",
    "data.freelancerProfileId.skills",
    "data.freelancerProfileId.expertise",
    "data.freelancerProfileId.certifications",
    "data.freelancerProfileId.name",
    "data.coverLetter",
    "data.proposedRate",
    "data.availability",
    "data.relevantSkills",
    "data.attachments",
    "data.certificationAcknowledgment",
    "data.status",
    "data.proposedMilestones",
    "data.interviews",
    "data.createdAt",
    "data.updatedAt",
    "data.lastStatusChangeAt",
    "data.draftExpiresAt",
    "data.__v"
]