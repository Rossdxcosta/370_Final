import { Component, HostBinding, OnInit, AfterViewChecked, ViewChild, signal } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FAQService } from "../../../Services/FAQ/faq.service";
import { FAQWithCategory } from "../../../Classes/faq-with-category.classes";
// import { initAccordions } from "flowbite";
import { AuthService } from "../../../Services/Login/auth.service";

@Component({
  selector: "app-faq-list",
  templateUrl: "./faq-list.component.html",
  styleUrls: ["./faq-list.component.scss"],
})
export class FaqListComponent implements OnInit, AfterViewChecked {
    //////////////////////////////////////////////////////////////////////////////////// DARKMODE STARTS

    darkMode = signal<boolean>(false);
    @HostBinding("class.dark") get mode() {
      return this.darkMode();
    }
  
    setDarkMode() {
      this.darkMode.set(!this.darkMode());
  
      localStorage.setItem("darkMode", this.darkMode.toString());
    }
  
    getDarkMode() {
      console.log(localStorage.getItem("darkMode"));
      if (localStorage.getItem("darkMode") == "[Signal: true]") {
        return true;
      } else {
        return false;
      }
    }
  
    /////////////////////////////////////////////////////////////////////////////////// DARKMODE ENDS
  dataSource = new MatTableDataSource<FAQWithCategory>();
  faqCategories: { CategoryName: string; FAQs: FAQWithCategory[] }[] = [];
  filteredFaqCategories: { CategoryName: string; FAQs: FAQWithCategory[] }[] = [];
  searchQuery: string = "";
  activeIndex: number | null = null; 
  activeFAQ: number | null = null;  
  loggedIn: Boolean = false; 

  private accordionsInitialized = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private faqService: FAQService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadFAQs();
    this.darkMode.set(this.getDarkMode());
    if (this.auth.isLoggedIn()) {
      this.loggedIn = true;
    }
  }

  ngAfterViewChecked() {
    if (!this.accordionsInitialized && this.filteredFaqCategories.length > 0) {
      // initAccordions(); // Reinitialize Flowbite accordions
      this.accordionsInitialized = true;
    }
  }

  loadFAQs(): void {
    this.faqService.getFAQsAndCategories().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.faqCategories = this.groupFAQsByCategory(data);
        this.filteredFaqCategories = this.faqCategories;
        this.accordionsInitialized = false;
      },
      (error) => {
        console.error("Error fetching FAQs and categories", error);
      }
    );
  }

  groupFAQsByCategory(data: FAQWithCategory[]): { CategoryName: string; FAQs: FAQWithCategory[] }[] {
    const categoriesMap: { [key: string]: FAQWithCategory[] } = {};

    data.forEach((faq) => {
      const categoryName = faq.categoryName;
      if (!categoriesMap[categoryName]) {
        categoriesMap[categoryName] = [];
      }
      categoriesMap[categoryName].push(faq);
    });

    return Object.keys(categoriesMap).map((key) => ({
      CategoryName: key,
      FAQs: categoriesMap[key],
    }));
  }

  filterFAQs(): void {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredFaqCategories = this.faqCategories;
      return;
    }

    this.filteredFaqCategories = this.faqCategories
      .map((category) => ({
        ...category,
        FAQs: category.FAQs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.FAQs.length > 0);

    this.accordionsInitialized = false;
  }

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index; 
  }

  toggleFAQ(faqId: number): void {
    this.activeFAQ = this.activeFAQ === faqId ? null : faqId; 
  }
}
