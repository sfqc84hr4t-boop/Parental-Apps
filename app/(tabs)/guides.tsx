import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "@/stores/familyStore";
import { supabase } from "@/lib/supabase";
import { LibraryArticle } from "@/lib/types";
import { getBabyAgeWeeks, getFrameworkLabel, AFFILIATE_PRODUCTS } from "@/lib/helpers";

const CATEGORIES = ["All", "Sleep", "Feeding", "Development", "Soothing", "Wellbeing", "Behaviour"];

const CATEGORY_COLOURS: Record<string, string> = {
  sleep: "#E5EEFB",
  feeding: "#FFF4EC",
  development: "#E5F5EC",
  soothing: "#EDE8F5",
  wellbeing: "#FFF0F3",
  behaviour: "#FFF8E5",
};

function ArticleCard({
  article,
  onPress,
}: {
  article: LibraryArticle;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-3xl p-5 mb-3 border border-border-soft"
      style={{
        backgroundColor: CATEGORY_COLOURS[article.category.toLowerCase()] ?? "#FFF4EC",
      }}
    >
      <View className="flex-row items-start gap-x-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-x-2 mb-1">
            <Text
              className="text-text-muted text-xs uppercase"
              style={{ fontFamily: "Nunito_600SemiBold", letterSpacing: 0.5 }}
            >
              {article.category}
            </Text>
            {article.read_time_minutes && (
              <Text
                className="text-text-muted text-xs"
                style={{ fontFamily: "Nunito_400Regular" }}
              >
                · {article.read_time_minutes} min read
              </Text>
            )}
          </View>
          <Text
            className="text-base text-text-primary"
            style={{ fontFamily: "Nunito_700Bold" }}
          >
            {article.title}
          </Text>
          {article.summary && (
            <Text
              className="text-text-secondary text-sm mt-1"
              style={{ fontFamily: "Nunito_400Regular", lineHeight: 20 }}
            >
              {article.summary}
            </Text>
          )}
          {/* Framework tags */}
          {article.framework_tags.length > 0 && (
            <View className="flex-row flex-wrap gap-1 mt-3">
              {article.framework_tags.slice(0, 2).map((tag) => (
                <View
                  key={tag}
                  className="bg-white/70 rounded-full px-2 py-0.5 border border-border-soft"
                >
                  <Text
                    className="text-text-muted text-xs"
                    style={{ fontFamily: "Nunito_600SemiBold" }}
                  >
                    {getFrameworkLabel(tag).split(" ").slice(-1)[0]}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={{ fontSize: 24, opacity: 0.6 }}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

function ProductCard({ product }: { product: typeof AFFILIATE_PRODUCTS[0] }) {
  return (
    <View className="bg-card-warm rounded-2xl p-4 border border-border-soft mr-3" style={{ width: 200 }}>
      <Text style={{ fontSize: 32 }}>{product.emoji}</Text>
      <Text
        className="text-text-primary text-sm mt-2"
        style={{ fontFamily: "Nunito_700Bold" }}
      >
        {product.name}
      </Text>
      <Text
        className="text-text-muted text-xs mt-1"
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        {product.description}
      </Text>
      <Text
        className="text-terracotta text-base mt-2"
        style={{ fontFamily: "Nunito_700Bold" }}
      >
        {product.price}
      </Text>
      <Text
        className="text-text-muted text-xs mt-1"
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        *Affiliate link
      </Text>
    </View>
  );
}

export default function GuidesScreen() {
  const router = useRouter();
  const { family, baby } = useFamilyStore();
  const [articles, setArticles] = useState<LibraryArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const ageWeeks = baby?.date_of_birth ? getBabyAgeWeeks(baby) : 0;

  useEffect(() => {
    loadArticles();
  }, [ageWeeks, family]);

  const loadArticles = async () => {
    let query = supabase
      .from("library_articles")
      .select("*")
      .order("sort_order");

    const { data } = await query;
    if (data) {
      // Filter to relevant age range + frameworks
      const relevant = data.filter((a) => {
        const ageOk =
          (a.age_weeks_min === null || ageWeeks >= a.age_weeks_min - 4) &&
          (a.age_weeks_max === null || ageWeeks <= a.age_weeks_max + 8);
        const frameworkOk =
          a.framework_tags.length === 0 ||
          a.framework_tags.some((t) => family?.frameworks.includes(t));
        return ageOk && frameworkOk;
      });
      setArticles(relevant.length > 0 ? relevant : data);
    }
    setIsLoading(false);
  };

  const filtered = articles.filter((a) => {
    const catOk =
      activeCategory === "All" ||
      a.category.toLowerCase() === activeCategory.toLowerCase();
    const searchOk =
      search.length === 0 ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary?.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  // Stage products
  const stageProducts = AFFILIATE_PRODUCTS.filter((p) =>
    p.stage.includes(family?.stage ?? "infant")
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator color="#E07A5F" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-3 border-b border-border-soft">
          <Text
            className="text-2xl text-text-primary"
            style={{ fontFamily: "Nunito_800ExtraBold" }}
          >
            Your Guides 📚
          </Text>
          <Text
            className="text-text-muted text-sm"
            style={{ fontFamily: "Nunito_400Regular" }}
          >
            Tailored to {baby?.name ?? "your baby"} and your chosen frameworks
          </Text>
        </View>

        {/* Search */}
        <View className="px-5 mt-4">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search guides..."
            placeholderTextColor="#9E9690"
            className="bg-card-warm rounded-2xl px-4 py-3 border border-border-soft"
            style={{ fontFamily: "Nunito_400Regular" }}
          />
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 border ${
                activeCategory === cat
                  ? "bg-terracotta border-terracotta"
                  : "bg-card-warm border-border-soft"
              }`}
            >
              <Text
                className={activeCategory === cat ? "text-white" : "text-text-secondary"}
                style={{
                  fontFamily:
                    activeCategory === cat ? "Nunito_700Bold" : "Nunito_400Regular",
                  fontSize: 13,
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Articles */}
        <View className="px-5 mt-5">
          {filtered.length === 0 ? (
            <View className="items-center py-10">
              <Text style={{ fontSize: 40 }}>📖</Text>
              <Text
                className="text-text-muted text-base text-center mt-3"
                style={{ fontFamily: "Nunito_400Regular" }}
              >
                No guides found. Try a different search.
              </Text>
            </View>
          ) : (
            filtered.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onPress={() => {}}
              />
            ))
          )}
        </View>

        {/* Kindroots Recommends */}
        {stageProducts.length > 0 && (
          <View className="mt-8">
            <View className="px-5 mb-3 flex-row items-center gap-x-2">
              <Text
                className="text-text-primary text-base"
                style={{ fontFamily: "Nunito_700Bold" }}
              >
                Kindroots Recommends
              </Text>
              <Text
                className="text-text-muted text-xs"
                style={{ fontFamily: "Nunito_400Regular" }}
              >
                *Affiliate links
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
            >
              {stageProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ScrollView>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
