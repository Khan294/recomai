const express = require('express');
const { Case, Category } = require('../../models');
const router = express.Router();

const PAGE_SIZE = 10;

router.get('/', async (req, res) => {
  
  try {
    let page = parseInt(req.query.page);
    if (!page || page < 1) {
      page = 1;
    }

    const cases = await Case.findAndCountAll({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      message: "Fetched successfully.",
      data: cases.rows,
      total: cases.count,
      totalPages: Math.ceil(cases.count / PAGE_SIZE),
      currentPage: page,
    });

  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const caseItem = await Case.findByPk(req.params.id, {
      include: [Category]
    });
    if (!caseItem) {
      return res.status(404).json({ message: "Not found." });
    }
    res.status(200).json({ message: "Fetched successfully.", data: caseItem });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCase = await Case.create(req.body);
    res.status(201).json({ message: "Created successfully.", data: newCase});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Case.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCase = await Case.findByPk(req.params.id);
      res.status(200).json({ message: "Updated successfully.", data: updatedCase });
    } else {
      res.status(404).json({ message: "Not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Case.destroy({
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
