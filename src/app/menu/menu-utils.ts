import { MenuItem } from 'primeng/api';

export class MenuUtils {

  private static menuConcordance = [
    {
      label: 'Concordance',
      icon: '',
      url: 'concordance'
    },
    {
      label: 'Word list',
      icon: '',
      url: 'word_list',
    },
    {
      label: 'Corpus info',
      icon: '',
      url: 'corpus_info'
    },
    {
      label: 'My jobs',
      icon: '',
      url: 'my_job'
    },
    {
      label: '',
      icon: 'pi pi-question-circle',
      url: 'https://www.sketchengine.co.uk/documentationmain-sketch-engine-links'
    },
    {
      label: 'User guide',
      icon: '',
      url: 'https://www.sketchengine.co.uk/documentation',
    }
  ];

  private static menuWordList = [
    {
      label: 'Concordance',
      icon: '',
      url: 'concordance'
    },
    {
      label: 'Word list',
      icon: '',
      url: 'word_list',
    },
    {
      label: 'Corpus info',
      icon: '',
      url: 'corpus_info'
    },
    {
      label: 'My jobs',
      icon: '',
      url: 'my_job'
    },
    {
      label: '',
      icon: 'pi pi-question-circle',
      url: 'https://www.sketchengine.co.uk/documentationmain-sketch-engine-links'
    },
    {
      label: 'User guide',
      icon: '',
      url: 'https://www.sketchengine.co.uk/documentation',
    },
    {
      label: 'All words',
      icon: '',
      url: 'all_words'
    },
    {
      label: 'All lemmans',
      icon: '',
      url: 'all_lemmans'
    },
    {
      label: '',
      icon: 'pi pi-question-circle',
      url: 'https://www.sketchengine.co.uk/documentationword-list'
    }
  ];



  public static getMenu(page: string): MenuItem[] {

    switch (page) {
      case 'concordance':
      case 'home': {
        return this.menuConcordance;
      }
      case 'all_words':
      case 'all_lemmans': {
        return this.menuWordList;
      }
      default: {
        return this.menuConcordance;
      }

    }
  }




}