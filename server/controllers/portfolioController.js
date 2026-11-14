const Portfolio = require('../models/Portfolio');

// Helper to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
exports.getAllPortfolio = async (req, res, next) => {
  try {
    const { category, featured, limit } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let findQuery = Portfolio.find(query).sort({ featured: -1, createdAt: -1 });

    if (limit) {
      findQuery = findQuery.limit(parseInt(limit, 10));
    }

    const projects = await findQuery;

    res.status(200).json({
      success: true,
      count: projects.length,
      portfolio: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single portfolio item by id or slug
// @route   GET /api/portfolio/:id
// @access  Public
exports.getPortfolioById = async (req, res, next) => {
  try {
    let project = null;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Portfolio.findById(req.params.id);
    }

    if (!project) {
      project = await Portfolio.findOne({ slug: req.params.id });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio project not found.',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new portfolio item (Admin only)
// @route   POST /api/admin/portfolio
// @access  Private (Admin)
exports.createPortfolio = async (req, res, next) => {
  try {
    const {
      title,
      description,
      fullDescription,
      category,
      technologies,
      image,
      projectUrl,
      client,
      impactMetrics,
      featured,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required.',
      });
    }

    // Slug generation
    let baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Portfolio.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // Parse arrays if needed
    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === 'string') {
      try {
        techArray = JSON.parse(technologies);
      } catch {
        techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    let metricsArray = [];
    if (Array.isArray(impactMetrics)) {
      metricsArray = impactMetrics;
    } else if (typeof impactMetrics === 'string') {
      try {
        metricsArray = JSON.parse(impactMetrics);
      } catch {
        metricsArray = impactMetrics.split('\n').map((m) => m.trim()).filter(Boolean);
      }
    }

    let finalImageUrl = image || '';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const portfolioItem = await Portfolio.create({
      title: title.trim(),
      slug: uniqueSlug,
      description: description.trim(),
      fullDescription: fullDescription || '',
      category,
      technologies: techArray.length ? techArray : ['Full Stack'],
      image: finalImageUrl,
      projectUrl: projectUrl || '',
      client: client || 'Enterprise Partner',
      impactMetrics: metricsArray,
      featured: featured === true || featured === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio item created successfully.',
      project: portfolioItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio item (Admin only)
// @route   PUT /api/admin/portfolio/:id
// @access  Private (Admin)
exports.updatePortfolio = async (req, res, next) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found.',
      });
    }

    const {
      title,
      description,
      fullDescription,
      category,
      technologies,
      image,
      projectUrl,
      client,
      impactMetrics,
      featured,
    } = req.body;

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (fullDescription !== undefined) project.fullDescription = fullDescription;
    if (category) project.category = category;
    if (projectUrl !== undefined) project.projectUrl = projectUrl;
    if (client !== undefined) project.client = client;
    if (featured !== undefined) project.featured = featured === true || featured === 'true';

    if (technologies) {
      if (Array.isArray(technologies)) {
        project.technologies = technologies;
      } else if (typeof technologies === 'string') {
        try {
          project.technologies = JSON.parse(technologies);
        } catch {
          project.technologies = technologies.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }

    if (impactMetrics !== undefined) {
      if (Array.isArray(impactMetrics)) {
        project.impactMetrics = impactMetrics;
      } else if (typeof impactMetrics === 'string') {
        try {
          project.impactMetrics = JSON.parse(impactMetrics);
        } catch {
          project.impactMetrics = impactMetrics.split('\n').map((m) => m.trim()).filter(Boolean);
        }
      }
    }

    if (req.file) {
      project.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      project.image = image;
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio item updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio item (Admin only)
// @route   DELETE /api/admin/portfolio/:id
// @access  Private (Admin)
exports.deletePortfolio = async (req, res, next) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found.',
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Portfolio item removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

