const express = require('express');
const { Tag, InformationTag, Category } = require('../../models');
const router = express.Router();

const PAGE_SIZE = 10;

router.get('/', async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page || page < 1) {
      page = 1;
    }

    const tags = await Tag.findAndCountAll({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      order: [['name', 'ASC']],
    });

    res.json({
      message: "Fetched successfully.",
      data: tags.rows,
      total: tags.count,
      totalPages: Math.ceil(tags.count / PAGE_SIZE),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [InformationTag,
        { model: Category, as: 'category' }
      ]
    });
    if (!tag) {
      return res.status(404).json({ message: "Not found." });
    }
    res.status(200).json({ message: "Fetched successfully.", data: tag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json({ message: "Created successfully.", data: newTag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Tag.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTag = await Tag.findByPk(req.params.id, {
        include: [InformationTag,
          { model: Category, as: 'category' }
        ]
      });
      res.status(200).json({ message: "Updated successfully.", data: updatedTag });
    } else {
      res.status(404).json({ message: "Not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(200).json({ message: 'Deleted successfully.' });
    } else {
      res.status(404).json({ message: "Not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
