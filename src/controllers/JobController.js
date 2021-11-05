const Profile = require("../models/Profile");
const Job = require("../models/Job");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  create(request, response) {
    return response.render("job");
  },
  save(request, response) {
    const jobs = Job.get();
    const lastId = jobs[jobs.length - 1]?.id || 0; // .? => optional chaining operator

    jobs.push({
      id: lastId + 1,
      name: request.body.name,
      "daily-hours": request.body["daily-hours"],
      "total-hours": request.body["total-hours"],
      created_at: Date.now(),
    });

    return response.redirect("/");
  },
  show(request, response) {
    const jobs = Job.get();
    const profile = Profile.get();

    const jobId = request.params.id;
    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return response.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-per-hour"]);

    return response.render("job-edit", { job });
  },
  update(request, response) {
    const jobs = Job.get();

    const jobId = request.params.id;
    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return response.send("Job not found!");
    }

    const updatedJob = {
      ...job,
      name: request.body.name,
      "daily-hours": request.body["daily-hours"],
      "total-hours": request.body["total-hours"],
    };

    const newJobs = jobs.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    });
    Job.update(newJobs);

    return response.redirect(`/job/${jobId}`);
  },
  delete(request, response) {
    const jobId = request.params.id;
    Job.delete(jobId);

    return response.redirect("/");
  },
};
