const express = require('express');
const { Information, Tag, InformationTag, Case } = require('../../models');
const router = express.Router();

const PAGE_SIZE = 10;

router.get('/', async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page || page < 1) {
      page = 1;
    }

    const informationEntries = await Information.findAndCountAll({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: "Fetched successfully.",
      data: informationEntries.rows,
      total: informationEntries.count,
      totalPages: Math.ceil(informationEntries.count / PAGE_SIZE),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const informationEntry = await Information.findByPk(req.params.id, {
      include: [
        { model: Case, as: 'case' },
        { model: Tag, as: 'Tags', through: { model: InformationTag, attributes: [] }}
      ],
    });
    if (!informationEntry) {
      return res.status(404).json({ message: "Not found." });
    }
    res.status(200).json({ message: "Fetched successfully.", data: informationEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { tagIds, ...informationData } = req.body;

    const newInformationEntry = await Information.create(informationData);

    if (tagIds && Array.isArray(tagIds)) {
      await newInformationEntry.setTags(tagIds); // This sets (associates) tags by their IDs
    }
    
    const resultWithTags = await Information.findByPk(newInformationEntry.id, {
      include: [
        { model: Tag, as: 'Tags', through: { attributes: [] } },
        { model: Case, as: 'case' }
      ]
    });

    res.status(201).json({ message: "Created successfully.", data: resultWithTags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { tagIds, ...informationData } = req.body;
    const information = await Information.findByPk(req.params.id);

    if (!information) {
      return res.status(404).json({ message: "Not found." });
    }

    await information.update(informationData);

    if (tagIds && Array.isArray(tagIds)) {
      await information.setTags(tagIds);
    }

    const updatedInformationEntry = await Information.findByPk(req.params.id, {
      include: [
        { model: Tag, as: 'Tags', through: { attributes: [] } },
        { model: Case, as: 'case' }
      ]
    });

    res.status(200).json({ message: "Updated successfully.", data: updatedInformationEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Information.destroy({
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
