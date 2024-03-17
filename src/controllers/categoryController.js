const express = require('express');
const { Category, Tag, Case } = require('../../models');
const router = express.Router();

const PAGE_SIZE = 10;

router.get('/', async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page || page < 1) {
      page = 1;
    }

    const categories = await Category.findAndCountAll({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: "Fetched successfully.",
      data: categories.rows,
      total: categories.count,
      totalPages: Math.ceil(categories.count / PAGE_SIZE),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Tag, {
        model: Case,
        as: 'case'
      }],
    });
    if (!category) {
      return res.status(404).json({ message: "Not found." });
    }
    res.status(200).json({ message: "Fetched successfully.", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body, {
      include: [Tag]
    });

    res.status(201).json({ message: "Created successfully.", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCategory = await Category.findByPk(req.params.id, {
        include: [Tag, {
          model: Case,
          as: 'case'
        }],
      });
      res.status(200).json({ message: "Updated successfully.", data: updatedCategory });
    } else {
      res.status(404).json({ message: "Not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.destroy({
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
